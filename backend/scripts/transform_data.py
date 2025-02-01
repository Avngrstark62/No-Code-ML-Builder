from sklearn.impute import SimpleImputer

def impute_missing_values(data,config):
    '''
    config = {
        'transform_type': 'impute_missing_values',
        'columns': USER_CHOICE(LIST OF STRINGS),
        'strategy': USER_CHOICE('mean','median','most_frequent','constant'),
        'fill_value': USER_CHOICE(STRING OR INT) # only required if strategy is 'constant'
    }
    '''
    df = data.copy()
    columns=config['columns']
    strategy=config['strategy']
    fill_value=config['fill_value'] if 'fill_value' in config else None

    imputer = SimpleImputer(strategy=strategy,fill_value=fill_value)
    df[columns] = imputer.fit_transform(df[columns])

    return df

def delete_columns(data,config):
    '''
    config = {
        'transform_type': 'delete_columns',
        'columns': USER_CHOICE(LIST OF STRINGS)
    }
    '''
    df = data.copy()
    columns=config['columns']

    df=df.drop(columns=columns)
    return df

def add_column(data,config):
    '''
    config = {
        'transform_type': 'add_column',
        'column_name': USER_CHOICE(STRING),
        'value': USER_CHOICE(STRING OR INT)
    }
    '''
    df = data.copy()
    column_name=config['column_name']
    value=config['value']

    df[column_name] = value

    return df

function_map = {
    'impute_missing_values': impute_missing_values,
    'delete_columns': delete_columns,
    'add_column': add_column
}

def transform_data(df,config):

    transform_type = config['transform_type']
    transform_function = function_map[transform_type]
    df = transform_function(df,config)

    return df


{
    "transform_type": "delete_columns",
    "columns": ["mjob", "fjob"]
}