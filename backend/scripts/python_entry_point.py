import sys
import os
import pandas as pd
import json

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
sys.path.insert(0, project_root)

from backend.config.db_python import connect_db, fetch_table_data

def main():
    try:
        input_table_name = sys.argv[1]
        output_table_name = sys.argv[2]
        engine = connect_db()
        df = fetch_table_data(engine.connect(), input_table_name)

        config_file_path = os.path.join(os.path.dirname(__file__), "../../backend/tmp/config.txt")
        if not os.path.exists(config_file_path):
            print(f"Config file not found at: {config_file_path}")
            sys.exit(2)
        with open(config_file_path, "w") as file:
            file.write('writable')
        # with open(config_file_path, "r") as file:
        #     config = json.load(file)


        df['new_column'] = 2

        df.to_sql(output_table_name, engine, if_exists='replace', index=False)
        print('saved table named',output_table_name)
    
    except Exception as e:
        print("Error occurred:", e)
        sys.exit(1)
    
    finally:
        if engine:
            engine.dispose()

if __name__ == "__main__":
    main()
    sys.stdout.flush()