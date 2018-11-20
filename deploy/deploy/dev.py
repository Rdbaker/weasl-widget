# -*- coding: utf-8 -*-

"""\
© Copyright 2016, Partnr. All rights reserved.
"""
from deploy import upload as deploy_upload


def upload():
    deploy_upload(['--environment', 'development', '--gitref', 'master'])

if __name__ == '__main__':
    upload()