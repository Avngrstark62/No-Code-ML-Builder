import sys
import os
import pandas as pd  # Assuming pandas is used for DataFrame operations

# Add the project root directory to sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
sys.path.insert(0, project_root)

from backend.config.db_python import connect_db, fetch_table_data

def main():
    if len(sys.argv) < 4:
        print("Error: Insufficient arguments provided.")
        sys.exit(1)

    try:
        # Retrieve arguments passed from Node.js
        last_output = sys.argv[1]
        project_id = sys.argv[2]
        element_id = sys.argv[3]

        # Step 1: Connect to the database using SQLAlchemy engine
        engine = connect_db()

        # Step 2: Fetch data from the specified table (last_output)
        data = fetch_table_data(engine.connect(), last_output)

        # Add a new column to the DataFrame
        data['new_column'] = 1

        # Step 3: Write DataFrame back to the database with a new table name
        output_table_name = f'pipeline_output_{project_id}_{element_id}'
        data.to_sql(output_table_name, engine, if_exists='replace', index=False)

        # Return the output table name as stdout
        print(output_table_name)
    
    except Exception as e:
        print("Error occurred:", e)
        sys.exit(1)
    
    finally:
        if engine:
            engine.dispose()  # Properly close SQLAlchemy engine

if __name__ == "__main__":
    main()
    sys.stdout.flush()