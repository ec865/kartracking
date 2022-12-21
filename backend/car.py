import json
import boto3
import logging
import traceback

from boto3.dynamodb.conditions import Attr
from generate_json import *

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Get the service resource.
client = boto3.resource('dynamodb')
table_name = 'cars'
table = client.Table(table_name)

def add_car(data):
    try:
        response = get_car_by_car_id(data['car_id'])
        if (response['statusCode'] == 200): #Check if the partition key 'car_id' already exists by comparing the statusCode of the response
            return build_response(400, "Given car_id: " + data['car_id'] + " already exists!")
        #Check whether every required value is present
        if ('user_id' in data and 'engine_size' in data and 'fuel_type' in data and 'initial_odometer' in data and 'make' in data and 'model' in data and 'model_id' in data and 'model_year' in data and 'fuel_capacity' in data):
            data['initial_odometer'] = int(data['initial_odometer']) #Convert to int 
            table.put_item(Item=data)
            return build_response(200, "New car has been added!")
        return build_response(400, "Please include every required parameter!")
    except:
        return build_response(400, "Please specify a 'car_id'")

def edit_car(data):
    try:
        response = get_car_by_car_id(data['car_id'])
        #Check if the partition key 'car_id' already exists by comparing the statusCode of the response
        if (response['statusCode'] == 200):
            #Check whether every required value is present
            if ('user_id' in data and 'engine_size' in data and 'fuel_type' in data and 'initial_odometer' in data and 'make' in data and 'model' in data and 'model_id' in data and 'model_year' in data and 'fuel_capacity' in data):
                data['initial_odometer'] = int(data['initial_odometer'])
                table.put_item(Item=data)
                return build_response(200, "The car has been edited!")
            return build_response(400, "Please include every required parameter!")
        return build_response(400, "Given car_id: " + data['car_id'] + " does not exist!")
            
    except:
        return build_response(400, "Please specify a 'car_id'")
    
        
def get_cars():
    response = table.scan()['Items']
    return build_response(200, response)
    
def get_car_by_car_id(car_id):
    try:
        response = table.get_item(Key={'car_id' : car_id})['Item']
        return build_response(200, response)
    except:
        return build_response(404, "Not found")

def get_cars_by_user_id(user_id):
    try:
        response = table.scan(FilterExpression=Attr('user_id').eq(user_id))['Items']
        return build_response(200, sorted(response, key=lambda x: x['car_id'].lower())) #Return the cars in sorted order
    except:
        return build_response(404, "Not found")
        
def get_models():
    cars = table.scan()['Items']
    models = []
    for car in cars:
        model_id = car['model_id']
        parameters = model_id.split('_')
        print(parameters)
        make = parameters[0]
        model = parameters[1]
        engine_size = parameters[2]
        model_name = make + ' ' + model + ' ' + engine_size
        model_dict = {}
        model_dict['model_id'] = model_id
        model_dict['model_name'] = model_name
        models.append(model_dict)
        
    return build_response(200, sorted(models, key=lambda x: x['model_name'].lower()))
    
#An extra function used while testing that gets a car by two parameters          
def get_car_by_user_id_car_id(user_id, car_id):
    try:
        response = table.scan(FilterExpression=Attr('user_id').eq(user_id) & Attr('car_id').eq(car_id))
        if (response['Count'] == 1):
            return build_response(200, response['Items'][0])
        elif (response['Count'] > 1):
            return build_response(400, "More than one car with the given user_id: '" + user_id + "' car_id: " + car_id + "'")
        else:
            return build_response(404, "No matching car with the given user_id: '" + user_id + "' car_id: " + car_id + "'")
    except:
        return build_response(404, "Not found")
        
def delete_car(car_id):
    try:
        car_response = get_car_by_car_id(car_id)
        if (car_response['statusCode'] != 200): #Check if the partition key 'car_id' already exists by comparing the statusCode of the response
            return build_response(car_response['statusCode'], "Given car_id: " + car_id + " does not exist!")
            
        delete_response = table.delete_item(Key={'car_id' : car_id})
        if (delete_response['ResponseMetadata']['HTTPStatusCode'] == 200):
            return build_response(200, "car_id: '" + car_id + "' has been deleted")
        else:
            return build_response(delete_response['ResponseMetadata']['HTTPStatusCode'], "There has been an error. Please check the 'car_id'")
    except Exception as e:
        return build_response(404, e)