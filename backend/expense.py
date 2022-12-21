import json
import boto3
import logging
from boto3.dynamodb.conditions import Attr
from generate_json import *

from botocore.exceptions import ClientError
from decimal import *

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Get the service resource.
client = boto3.resource('dynamodb')
table_name = 'expenses'
table = client.Table(table_name)

#Operations on the expense table. Functionalities are described with the function's name


def add_expense(data):
    try:
        response = get_expense_by_expense_id(data['expense_id'])
        #Check if the partition key 'expense_id' already exists by comparing the statusCode of the response
        if (response['statusCode'] == 200):
            return build_response(400, "Given expense_id: " + data['expense_id'] + " already exists!")
            
        #Check whether every required value is present
        if ('expense_id' in data and 'car_id' in data and 'model_id' in data and 'date' in data and 'odometer' in data and 'price' in data and 'expense_type' in data):
            #Convert necessary ones to int or Decimal to be stored
            data['odometer'] = int(data['odometer'])
            data['price'] = Decimal(data['price'])
            data['volume'] = Decimal(data['volume'])
            table.put_item(Item=data)
            return build_response(200, "New expense has been added!")
        return build_response(400, "Please include every required parameter!")
    except:
        return build_response(400, "Please specify an 'expense_id'")
        
        
def edit_expense(data):
    try:
        response = get_expense_by_expense_id(data['expense_id'])
         #Check if the partition key 'expense_id' already exists by comparing the statusCode of the response
        if (response['statusCode'] == 200):
            #Check whether every required value is present
            if ('expense_id' in data and 'car_id' in data and 'model_id' in data and 'date' in data and 'odometer' in data and 'price' in data and 'expense_type' in data):
                #Convert necessary ones to int or Decimal to be stored
                data['odometer'] = int(data['odometer'])
                data['price'] = Decimal(data['price'])
                data['volume'] = Decimal(data['volume'])
                table.put_item(Item=data)
                return build_response(200, "The expense has been edited!")
            return build_response(400, "Please include every required parameter!")
        return build_response(400, "Given expense_id: " + data['expense_id'] + " does not exist!")
    except ClientError as e:
        return build_response(400, e)
    

def get_expenses():
    response = table.scan()['Items']
    return build_response(200, sort_json(response, 'odometer'))
    
def get_expense_by_expense_id(expense_id):
    try:
        response = table.get_item(Key={'expense_id' : expense_id})['Item']
        return build_response(200, response)
    except:
         return build_response(404, "Not found")

def get_expenses_by_car_id(car_id):
    try:
        response = table.scan(FilterExpression=Attr('car_id').eq(car_id))['Items']
        return build_response(200, sort_json(response, 'odometer'))
    except:
        return build_response(404, "Not found")
        
        
#Finds the expenses by going through each the car with the given model_id
#Then calculates the averrage for each category
def get_expenses_by_model_id(model_id):
    try:
        expenses = table.scan(FilterExpression=Attr('model_id').eq(model_id))['Items']
        refuelling_sum, servicing_sum, insurance_sum, other_sum = 0, 0, 0, 0
        refuelling_count, servicing_count, insurance_count, other_count = 0, 0, 0, 0
        expense_dict = {'model_id': model_id, 'refuelling': 0, 'servicing': 0, 'insurance': 0, "other_expense": 0}

        for expense in expenses:
            if (expense['expense_type'] == "Refuelling"):
                refuelling_sum = refuelling_sum + float(expense['price'])
                refuelling_count += 1
                amount = refuelling_sum / refuelling_count
                expense_dict['refuelling'] = amount
                
            elif (expense['expense_type'] == "Servicing"):
                servicing_sum = servicing_sum + expense['price'] 
                servicing_count += 1
                amount = servicing_sum / servicing_count
                expense_dict['servicing'] = amount
                
            elif (expense['expense_type'] == "Insurance"):
                insurance_sum = insurance_sum + expense['price'] 
                insurance_count += 1
                amount = insurance_sum / insurance_count
                expense_dict['insurance'] = amount
                
            elif (expense['expense_type'] == "Other Expense"):
                other_sum = other_sum + expense['price'] 
                other_count += 1
                amount = other_sum / other_count
                expense_dict['other_expense'] = amount
                
        return build_response(200, expense_dict)
        
    except:
        return build_response(404, "Not found")
        
#An extra function used while testing that gets an expense by two parameters    
def get_expense_by_car_id_by_expense_id(car_id, expense_id):
    try:
        response = table.scan(FilterExpression=Attr('car_id').eq(car_id) & Attr('expense_id').eq(expense_id))
        if (response['Count'] == 1):
            return build_response(200, response['Items'][0])
        elif (response['Count'] > 1):
            return build_response(400, "More than one expense with the given car_id: '" + car_id + "' expense_id: " + expense_id + "'")
        else:
            return build_response(404, "No matching expense with the given car_id: '" + car_id + "' expense_id: '" + expense_id + "'")
    except:
        return build_response(404, "Not found")
        

def delete_expense(expense_id):
    try:
        expense_response = get_expense_by_expense_id(expense_id)
        if (expense_response['statusCode'] != 200): #Check if the partition key 'car_id' already exists by comparing the statusCode of the response
            return build_response(expense_response['statusCode'], "Given expense_id: " + expense_id + " does not exist!")
            
        delete_response = table.delete_item(Key={'expense_id' : expense_id})
        if (delete_response['ResponseMetadata']['HTTPStatusCode'] == 200):
            return build_response(200, "expense_id: '" + expense_id + "' has been deleted")
        else:
            return build_response(delete_response['ResponseMetadata']['HTTPStatusCode'], "There has been an error. Please check the 'expense_id'")
    except Exception as e:
        return build_response(404, e)