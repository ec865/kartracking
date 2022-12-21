import json
import boto3
import logging
import requests
from requests.exceptions import RequestException, HTTPError, URLRequired
from generate_json import *
  
logger = logging.getLogger()
logger.setLevel(logging.INFO)


# Get the service resource.
client = boto3.resource('dynamodb')
table_name = 'users'
table = client.Table(table_name)

#Used when the user's setting are changed
def add_user(data):
    try:
        #Check whether every required value is present
        if ('user_id' in data and 'distance_unit' in data and 'volume_unit' in data and 'fuel_efficiency_unit' in data and 'currency' in data):
            table.put_item(Item=data)
            return build_response(200, "New user has been added!")
        return build_response(400, "Please include every required parameter!")
    except Exception as e:
        return build_response(404, e)   
        
def get_user_by_user_id(user_id):
    try:
        response = table.get_item(Key={'user_id' : user_id})['Item']
        return build_response(200, response)
    except:
        return build_response(404, "Not found")

    
### Auth0 functions that were used while testing ###
def get_token():
    
    domain = 'dev-kvaqmgjn8xoqxfns.us.auth0.com'
    audience = f'https://dev-kvaqmgjn8xoqxfns.us.auth0.com/api/v2/'
    client_id = 'tFf9eIzcSZZnGYoQCiwlB4CoGeaSVhPW'
    client_secret = 'AMaX_wAlBt-BkFa-BFR9buqfBen4Rzf4Pkd9wkdQvq6Pt_ttQFb5-S-VuJ-Sb2iK'
    grant_type = "client_credentials" # OAuth 2.0 flow to use
    
    # Get an Access Token from Auth0
    base_url = f"https://{domain}"
    payload =  { 
    'grant_type': grant_type,
    'client_id': client_id,
    'client_secret': client_secret,
    'audience': audience
    }
    response = requests.post(f'{base_url}/oauth/token', data=payload)
    oauth = response.json()
    access_token = oauth.get('access_token')
    
    return access_token
    
def get_users():

    access_token = get_token()
    headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
    }
    
    try:
        res = requests.get(f'https://dev-kvaqmgjn8xoqxfns.us.auth0.com/api/v2/users', headers=headers)
        return build_response(200, res.json())
    except HTTPError as e:
        return build_response(404, f'HTTPError: {str(e.code)} {str(e.reason)}')
    except URLRequired as e:
        return build_response(404, f'URLRequired: {str(e.reason)}')
    except RequestException as e:
        return build_response(404, f'RequestException: {e}')
    except Exception as e:
        return build_response(404, f'Generic Exception: {e}')

def get_user(user_id):

    access_token = get_token()
    headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
    }
    
    try:
        res = requests.get(f'https://dev-kvaqmgjn8xoqxfns.us.auth0.com/api/v2/users/{user_id}', headers=headers)
        return build_response(200, res.json())
    except HTTPError as e:
        return build_response(404, f'HTTPError: {str(e.code)} {str(e.reason)}')
    except URLRequired as e:
        return build_response(404, f'URLRequired: {str(e.reason)}')
    except RequestException as e:
        return build_response(404, f'RequestException: {e}')
    except Exception as e:
        return build_response(404, f'Generic Exception: {e}')
        
        
        
        
        
        
        
