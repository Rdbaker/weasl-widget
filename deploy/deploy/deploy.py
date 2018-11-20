# -*- coding: utf-8 -*-

"""\
© Copyright 2016, Partnr. All rights reserved.
"""
import argparse
import logging
import os
import subprocess
from glob import glob
from sys import exit

import boto3

from constants import Constants

logging.basicConfig(format='%(name)-12s: %(levelname)-8s:%(message)s', level=logging.INFO)
deploy_logger = logging.getLogger('weasl.uploader')

S3 = boto3.resource('s3')


def upload_arg_parser():
    parser = argparse.ArgumentParser(
        description='Upload weasl embed static files.',
    )
    parser.add_argument('--environment', help='The bucket to upload the files to.', required=True,
        choices=['production', 'development'])
    parser.add_argument('--gitref', help='The git branch or tag to build and upload.', required=True)
    return parser


def clone_repo():
    deploy_logger.info(subprocess.check_output(Constants.COMMANDS['clone']))


def checkout_ref(ref):
    deploy_logger.info(subprocess.check_output(Constants.COMMANDS['checkout'] + [ref]))


def install_dependencies():
    deploy_logger.info(subprocess.check_output(Constants.COMMANDS['install']))


def build_embed():
    deploy_logger.info(subprocess.check_output(Constants.COMMANDS['build embed']))


def build_shim():
    deploy_logger.info(subprocess.check_output(Constants.COMMANDS['build shim']))


def get_content_type_from_ext(extension):
    return Constants.get_content_type(extension)


def upload_files(bucket):
    # recursively upload all files in ./tmp/partnr-frontend/dest to bucket
    files = glob(Constants.DIST_DIR + '/**/**.*', recursive=True)
    for fname in files:
        reldir = os.path.relpath('.', Constants.DIST_DIR)
        relfile = os.path.join(reldir, fname)
        # boto3 doesn't like relative files
        uploadfile = 'embed/{}'.format(os.path.relpath(fname, os.path.dirname(os.path.abspath(__file__)) + '/tmp/widget/dist'))
        # get the file extension
        _, file_extension = os.path.splitext(relfile)
        extra_args = { 'ACL':'public-read', 'ContentType': get_content_type_from_ext(file_extension) }
        if file_extension == '.html' or 'shim' in uploadfile:
            extra_args.update({
                'CacheControl': 'no-cache, no-store, must-revalidate',
                'Expires': 0,
                'ACL':'public-read',
            })
        deploy_logger.info(
            'Uploading {local_file} to {remote_file} in the {bucket} bucket'.format(
            local_file=relfile, remote_file=uploadfile, bucket=bucket.name)
        )
        bucket.upload_file(relfile, uploadfile, ExtraArgs=extra_args)

def make_clean():
    deploy_logger.info(subprocess.check_output(Constants.COMMANDS['clean']))


def upload(override_args=None):
    args = upload_arg_parser().parse_args(override_args)
    os.environ['ENV'] = args.environment
    cwd = os.getcwd()
    tmpdir = os.path.join(cwd, Constants.TMP_DIR)
    deploy_logger.info('Creating tmpdir: ' + tmpdir)
    os.mkdir(tmpdir)
    deploy_logger.info('cd-ing into tmpdir')
    os.chdir(Constants.TMP_DIR)
    deploy_logger.info('Cloning repository')
    clone_repo()
    deploy_logger.info('cd-ing into repo')
    os.chdir(Constants.REPO_DIR)
    deploy_logger.info('Checking out gitref: ' + args.gitref)
    checkout_ref(args.gitref)
    deploy_logger.info('Installing dependencies')
    install_dependencies()
    deploy_logger.info('Building app')
    build_shim()
    build_embed()
    deploy_logger.info('Connecting to bucket: ' + Constants.BUCKETS[args.environment])
    bucket = S3.Bucket(Constants.BUCKETS[args.environment])
    deploy_logger.info('cd-ing to build directory')
    os.chdir(Constants.DIST_DIR)
    deploy_logger.info('Uploading files')
    upload_files(bucket)
    deploy_logger.info('cd-ing to initial directory: ' + cwd)
    os.chdir(cwd)
    deploy_logger.info('Cleaning up after myself')
    make_clean()
    deploy_logger.info('DEPLOYED SUCCESSFULLY TO ' + Constants.BUCKETS[args.environment])
    exit(0)
