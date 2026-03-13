import sqlite3
import os
import csv

def list_all_data(filter_table=None) -> dict:
    db_path = os.path.join(os.path.dirname(__file__), 'data.db')
    
    if not os.path.exists(db_path):
        print(f"Database file not found at: {db_path}")
        return {"status": "error", "message": "Database file not found"}
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # To access columns by name
    cursor = conn.cursor()
    
    print("=== Database Information ===")
    print(f"Database path: {db_path}")
    print()
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print("Tables in database:")
    for table in tables:
        print(f"- {table['name']}")
    print()
    
    table_data = {}
    for table in tables:
        table_name = table['name']
        
        # Apply table filter if specified
        if filter_table and table_name != filter_table:
            continue
        
        print(f"=== {table_name} Table ===")
        
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        column_names = [col['name'] for col in columns]
        
        print("Columns:", ", ".join(column_names))
        print("-" * 80)
        
        cursor.execute(f"SELECT * FROM {table_name};" )
        rows = cursor.fetchall()
        
        table_data[table_name] = {
            "columns": column_names,
            "rows": len(rows)
        }
        
        if not rows:
            print("No data found")
        else:
            header = " | ".join(column_names)
            print(header)
            print("-" * 80)
            
            for row in rows:
                row_data = []
                for col in column_names:
                    value = row[col]
                    if isinstance(value, str) and len(value) > 30:
                        value = value[:27] + "..."
                    row_data.append(str(value))
                print(" | ".join(row_data))
        
        print(f"Total rows: {len(rows)}")
        print()
    
    conn.close()
    return {"status": "success", "table_data": table_data}
            

def export_to_csv(export_dir=None) -> list:
    db_path = os.path.join(os.path.dirname(__file__), 'data.db')
    
    if not os.path.exists(db_path):
        print(f"Database file not found at: {db_path}")
        return []
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # To access columns by name
    cursor = conn.cursor()
    
    if export_dir is None:
        export_dir = 'exports'
    os.makedirs(export_dir, exist_ok=True)
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print("=== Exporting to CSV ===")
    print(f"Export directory: {export_dir}")
    print()
    
    exported_files = []
    for table in tables:
        table_name = table['name']
        print(f"Exporting {table_name} table...")
        
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        column_names = [col['name'] for col in columns]
        
        cursor.execute(f"SELECT * FROM {table_name};" )
        rows = cursor.fetchall()
        
        csv_file_path = os.path.join(export_dir, f"{table_name}.csv")
        
        with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            
            writer.writerow(column_names)
            
            for row in rows:
                row_data = [row[col] for col in column_names]
                writer.writerow(row_data)
        
        exported_files.append(csv_file_path)
        print(f"✓ Exported {len(rows)} rows to {os.path.basename(csv_file_path)}")
    
    print()
    print("=== Export Complete ===")
    print(f"All tables have been exported to the 'exports' directory.")
    
    conn.close()
    return exported_files
        

def import_from_csv(import_dir=None) -> dict:
    db_path = os.path.join(os.path.dirname(__file__), 'data.db')
    
    if not os.path.exists(db_path):
        print(f"Database file not found at: {db_path}")
        return {"status": "error", "message": "Database file not found"}
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    if import_dir is None:
        import_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'exports')
    if not os.path.exists(import_dir):
        print(f"Import directory not found at: {import_dir}")
        print("Please export data first or create the directory with CSV files.")
        conn.close()
        return {"status": "error", "message": "Import directory not found"}
    
    csv_files = [f for f in os.listdir(import_dir) if f.endswith('.csv')]
    if not csv_files:
        print("No CSV files found in the imports directory.")
        conn.close()
        return {"status": "error", "message": "No CSV files found"}
    
    print("=== Importing from CSV ===")
    print(f"Import directory: {import_dir}")
    print()
    
    import_stats = {}
    total_rows = 0
    
    for csv_file in csv_files:
        table_name = os.path.splitext(csv_file)[0]
        csv_file_path = os.path.join(import_dir, csv_file)
        
        print(f"Importing {table_name} table from {csv_file}...")
        
        try:
            with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
                reader = csv.reader(csvfile)
                columns = next(reader)  # First row is header
                
                # Clear existing data in the table
                cursor.execute(f"DELETE FROM {table_name};")
                
                placeholders = ','.join(['?' for _ in columns])
                insert_query = f"INSERT INTO {table_name} ({','.join(columns)}) VALUES ({placeholders});"
                
                row_count = 0
                for row in reader:
                    processed_row = [None if val == '' else val for val in row]
                    cursor.execute(insert_query, processed_row)
                    row_count += 1
                
                conn.commit()
                import_stats[table_name] = row_count
                total_rows += row_count
                print(f"✓ Imported {row_count} rows into {table_name} table")
        except Exception as e:
            print(f"Error importing {table_name}: {e}")
            conn.rollback()
            import_stats[table_name] = 0
    
    print()
    print("=== Import Complete ===")
    print(f"Imported {total_rows} total rows from {len(csv_files)} files.")
    
    conn.close()
    return {"status": "success", "import_stats": import_stats, "total_rows": total_rows}
        


if __name__ == "__main__":
    print("1. List all data")
    print("2. Export to CSV")
    print("3. Import from CSV")
    choice = input("Enter your choice (1/2/3): ")
    
    if choice == '1':
        filter_table = input("Enter table name to filter (press Enter for all tables): ").strip()
        if filter_table:
            result = list_all_data(filter_table=filter_table)
        else:
            result = list_all_data()
        print("\nReturned data:", result)
    elif choice == '2':
        export_dir = input("Enter export directory (press Enter for default): ").strip()
        if export_dir:
            exported_files = export_to_csv(export_dir=export_dir)
        else:
            exported_files = export_to_csv()
        print("\nExported files:", exported_files)
    elif choice == '3':
        import_dir = input("Enter import directory (press Enter for default): ").strip()
        if import_dir:
            import_result = import_from_csv(import_dir=import_dir)
        else:
            import_result = import_from_csv()
        print("\nImport result:", import_result)
    else:
        print("Invalid choice. Exiting.")

