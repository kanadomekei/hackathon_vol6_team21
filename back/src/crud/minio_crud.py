import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
import os
import json
from urllib.parse import urlparse

def set_bucket_policy(bucket_name, minio_endpoint, minio_access_key, minio_secret_key):
    """
    バケットのポリシーを設定します。
    """
    s3 = boto3.client('s3',
                      endpoint_url=minio_endpoint,
                      aws_access_key_id=minio_access_key,
                      aws_secret_access_key=minio_secret_key,
                      config=Config(signature_version='s3v4'),
                      region_name='ap-northeast-1')
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": "*",
                "Action": ["s3:GetObject"],
                "Resource": [f"arn:aws:s3:::{bucket_name}/*"]
            }
        ]
    }
    policy_json = json.dumps(policy)
    s3.put_bucket_policy(Bucket=bucket_name, Policy=policy_json)
    print(f"Bucket policy set for {bucket_name}")
    
def create_bucket(bucket_name, minio_endpoint, minio_access_key, minio_secret_key):
    """
    新しいバケットを作成します。
    """
    s3 = boto3.client('s3',
                      endpoint_url=minio_endpoint,
                      aws_access_key_id=minio_access_key,
                      aws_secret_access_key=minio_secret_key,
                      config=Config(signature_version='s3v4'),
                      region_name='ap-northeast-1')
    try:
        s3.create_bucket(Bucket=bucket_name)
        print(f"Bucket {bucket_name} created")
        set_bucket_policy(bucket_name, minio_endpoint, minio_access_key, minio_secret_key)
    except ClientError as e:
        print(f"Error creating bucket: {e}")

def list_buckets(minio_endpoint, minio_access_key, minio_secret_key):
    """
    すべてのバケットをリストします。
    """
    s3 = boto3.client('s3',
                      endpoint_url=minio_endpoint,
                      aws_access_key_id=minio_access_key,
                      aws_secret_access_key=minio_secret_key,
                      config=Config(signature_version='s3v4'),
                      region_name='ap-northeast-1')
    response = s3.list_buckets()
    for bucket in response['Buckets']:
        print(bucket['Name'])
        
def upload_file_to_minio(file_path, bucket_name, object_name, minio_endpoint, minio_access_key, minio_secret_key):
    """
    ファイルをMinIOにアップロードします。
    """
    s3 = boto3.client('s3',
                      endpoint_url=minio_endpoint,
                      aws_access_key_id=minio_access_key,
                      aws_secret_access_key=minio_secret_key,
                      config=Config(signature_version='s3v4'),
                      region_name='ap-northeast-1')
    try:
        s3.head_bucket(Bucket=bucket_name)
    except ClientError:
        create_bucket(bucket_name, minio_endpoint, minio_access_key, minio_secret_key)
        set_bucket_policy(bucket_name, minio_endpoint, minio_access_key, minio_secret_key)
    s3.upload_file(file_path, bucket_name, object_name)
    object_url = f"{minio_endpoint}/{bucket_name}/{object_name}"
    print(f"File {file_path} uploaded to {object_url}")
    return object_url

def download_file_from_minio(bucket_name, object_name, file_path, minio_endpoint, minio_access_key, minio_secret_key):
    """
    MinIOからファイルをダウンロードします。
    """
    s3 = boto3.client('s3',
                      endpoint_url=minio_endpoint,
                      aws_access_key_id=minio_access_key,
                      aws_secret_access_key=minio_secret_key,
                      config=Config(signature_version='s3v4'),
                      region_name='ap-northeast-1')
    s3.download_file(bucket_name, object_name, file_path)
    print(f"File {object_name} downloaded to {file_path}")
    
def download_file_from_minio_by_url(file_url, file_path, minio_access_key, minio_secret_key):
    """
    URLを使用してMinIOからファイルをダウンロードします。
    """
    parsed_url = urlparse(file_url)
    minio_endpoint = f"{parsed_url.scheme}://{parsed_url.netloc}"
    bucket_name = parsed_url.path.split('/')[1]
    object_name = '/'.join(parsed_url.path.split('/')[2:])
    
    s3 = boto3.client('s3',
                      endpoint_url=minio_endpoint,
                      aws_access_key_id=minio_access_key,
                      aws_secret_access_key=minio_secret_key,
                      config=Config(signature_version='s3v4'),
                      region_name='ap-northeast-1')
    try:
        s3.download_file(bucket_name, object_name, file_path)
        print(f"File {object_name} downloaded to {file_path}")
    except ClientError as e:
        print(f"Error downloading file: {e}")

def list_objects_in_bucket(bucket_name, minio_endpoint, minio_access_key, minio_secret_key):
    """
    バケット内のオブジェクトをリストします。
    """
    s3 = boto3.client('s3',
                      endpoint_url=minio_endpoint,
                      aws_access_key_id=minio_access_key,
                      aws_secret_access_key=minio_secret_key,
                      config=Config(signature_version='s3v4'),
                      region_name='ap-northeast-1')
    response = s3.list_objects_v2(Bucket=bucket_name)
    for obj in response.get('Contents', []):
        print(obj['Key'])

def delete_object_from_minio(bucket_name, object_name, minio_endpoint, minio_access_key, minio_secret_key):
    """
    MinIOからオブジェクトを削除します。
    """
    s3 = boto3.client('s3',
                      endpoint_url=minio_endpoint,
                      aws_access_key_id=minio_access_key,
                      aws_secret_access_key=minio_secret_key,
                      config=Config(signature_version='s3v4'),
                      region_name='ap-northeast-1')
    s3.delete_object(Bucket=bucket_name, Key=object_name)
    print(f"Object {object_name} deleted from {bucket_name}")

def delete_bucket(bucket_name, minio_endpoint, minio_access_key, minio_secret_key):
    """
    バケットを削除します。
    """
    s3 = boto3.client('s3',
                      endpoint_url=minio_endpoint,
                      aws_access_key_id=minio_access_key,
                      aws_secret_access_key=minio_secret_key,
                      config=Config(signature_version='s3v4'),
                      region_name='ap-northeast-1')
    s3.delete_bucket(Bucket=bucket_name)
    print(f"Bucket {bucket_name} deleted")

# 使用例
if __name__ == "__main__":
    minio_endpoint = os.getenv('MINIO_ENDPOINT', 'http://minio:9000')
    minio_access_key = os.getenv('MINIO_ACCESS_KEY', 'minio')
    minio_secret_key = os.getenv('MINIO_SECRET_KEY', 'minio123')
    
    file_path = '/app/data/image1.jpg'
    bucket_name = 'mybucket'
    object_name = 'image1.txt'

    # set_bucket_policy(bucket_name, minio_endpoint, minio_access_key, minio_secret_key)
    # create_bucket(bucket_name, minio_endpoint, minio_access_key, minio_secret_key)
    # list_buckets(minio_endpoint, minio_access_key, minio_secret_key)
    # upload_file_to_minio(file_path, bucket_name, object_name, minio_endpoint, minio_access_key, minio_secret_key)
    # download_file_from_minio(bucket_name, object_name, 'file3.txt', minio_endpoint, minio_access_key, minio_secret_key)
    # download_file_from_minio_by_url("http://localhost:9000/mybucket1/file1.txt", file_path, minio_access_key, minio_secret_key)
    # list_objects_in_bucket(bucket_name, minio_endpoint, minio_access_key, minio_secret_key)
    # delete_object_from_minio(bucket_name, object_name, minio_endpoint, minio_access_key, minio_secret_key)
    # delete_bucket(bucket_name, minio_endpoint, minio_access_key, minio_secret_key)