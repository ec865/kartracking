import json
import boto3
import logging

from user import *
from car import *
from expense import *
from generate_json import *

logger = logging.getLogger()
logger.setLevel(logging.INFO)

#General routing to call the related function depending on the request's path and http method.

def lambda_handler(event, context):
    logger.info(event)

    http_method = event['httpMethod']
    path = event['path']
    
    #Check if there are parameters and assign them accordingly
    if (event["queryStringParameters"] is not None):
        arguments = event['queryStringParameters']
        for key in arguments:
            if (key == "car_id"):
                car_id = arguments[key]
            elif (key == "user_id"):
                user_id = arguments[key]
            elif (key == "expense_id"):
                expense_id = arguments[key]
            elif (key == "model_id"):
                model_id = arguments[key]

        #Functions for Car
        if (http_method == 'GET' and path == '/car' and "user_id" in arguments and "car_id" in arguments):
            return get_car_by_user_id_car_id(user_id, car_id)
        elif (http_method == 'GET' and path == '/car' and "car_id" in arguments):
            return get_car_by_car_id(car_id)
        elif (http_method == 'GET' and path == '/car' and "user_id" in arguments):
            return get_cars_by_user_id(user_id)
        elif (http_method == 'POST' and path == '/car'):
            return add_car(event['queryStringParameters'])
        elif (http_method == 'PUT' and path == '/car'):
            return edit_car(event['queryStringParameters'])
        elif (http_method == 'DELETE' and path == '/car' and "car_id" in arguments):
            return delete_car(car_id)
        
        #Functions for User
        elif (http_method == 'GET' and path == '/user' and "user_id" in arguments):
            return get_user_by_user_id(user_id)
        elif (http_method == 'POST' and path == '/user' and "user_id" in arguments):
            return add_user(event['queryStringParameters'])
            
        #Functions for Expense
        elif (http_method == 'GET' and path == '/expense' and "car_id" in arguments and "expense_id" in arguments):
            return get_expense_by_car_id_by_expense_id(car_id, expense_id)
        elif (http_method == 'GET' and path == '/expense' and "expense_id" in arguments):
            return get_expense_by_expense_id(expense_id)
        elif (http_method == 'GET' and path == '/expense' and "car_id" in arguments):
            return get_expenses_by_car_id(car_id)
        elif (http_method == 'GET' and path == '/expense' and "model_id" in arguments):
            return get_expenses_by_model_id(model_id)
        elif (http_method == 'POST' and path == '/expense' and "expense_id" in arguments):
            return add_expense(event['queryStringParameters'])
        elif (http_method == 'PUT' and path == '/expense' and "expense_id" in arguments):
            return edit_expense(event['queryStringParameters'])
        elif (http_method == 'DELETE' and path == '/expense' and "expense_id" in arguments):
            return delete_expense(expense_id)
            
        else:
            return build_response(404, "Error! No matching API!")
    
    #The fuctions that do not require a parameter to run
    else:
        if (http_method == 'GET' and path == '/'):
            return build_response(200, "Welcome to the CAR API!")
        elif (http_method == 'GET' and path == '/car'):
            return get_models()
        elif (http_method == 'GET' and path == '/user'):
            return get_users()
        elif (http_method == 'GET' and path == '/expense'):
            return get_expenses()
        else:
            return build_response(404, "Error! No matching API!")