import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
import os

def connect_db():
    try:
        # Create SQLAlchemy engine
        engine = create_engine(
            f"postgresql+psycopg2://{os.getenv('PG_USER')}:{os.getenv('PG_PASSWORD')}@{os.getenv('PG_HOST')}:{os.getenv('PG_PORT')}/{os.getenv('PG_DATABASE')}"
        )
        return engine
    except Exception as error:
        print(f"Error connecting to PostgreSQL: {error}")
        raise


def fetch_table_data(engine, table_name):
    try:
        # Fetch data using SQLAlchemy's connection to the database
        query = f"SELECT * FROM {table_name};"
        data = pd.read_sql(query, engine)  # Using SQLAlchemy engine directly to execute the query
        
        return data
    except SQLAlchemyError as error:
        print(f"Error fetching data from table {table_name}: {error}")
        raise