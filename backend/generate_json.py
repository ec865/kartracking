import json
import decimal

#A helper file that contains some functions used in other operations

def decimal_to_string(o):
    if isinstance(o, decimal.Decimal):
        return str(o)

def decimal_to_number(o):
    if isinstance(o, decimal.Decimal):
        return float(o)

#The function used while returning a response.
def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE,PATCH'
        },
        'body': json.dumps(body, default=decimal_to_string)
    }
    
def sort_json(data, value):
    json_list = []
    data = sorted(data, key=lambda k: k.get(value, 0), reverse=True)
    for row in data:
        json_list.append(row)
    return json_list