# -*- coding: utf-8 -*-

"""\
© Copyright 2016, Partnr. All rights reserved.
"""
from __future__ import unicode_literals

from setuptools import find_packages, setup


def read_from_req(f_name="requirements.txt"):
    ret = []
    with open(f_name) as f:
        for line in f:
            line = line.strip()
            if line.startswith('-') or line.startswith('#'):
                # This is a comment or index url, ignore it
                pass
            elif line:
                ret.append(line)
    return ret

requires = read_from_req()

setup(name='weasl_embed_upload',
    version='1.0.0',
    description='Upload weasl embed assets to the S3 bucket for the site.',
    packages=find_packages(),
    install_requires=requires,
    entry_points={
        'console_scripts': [
            'dev_deploy = deploy.dev:upload',
            'prd_deploy = deploy.prd:upload',
            'deploy = deploy.deploy:upload'
        ]
    },
    include_package_data=True
)
