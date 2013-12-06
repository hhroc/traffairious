#!/bin/env python
# -*- coding: utf8 -*-


from setuptools import setup, find_packages

version = "0.5.0"

setup(
    name="traffairious",
    version=version,
    description="Traffairious is a Traffic v.s. Air Quality Data Visualization Experiment",
    classifiers=[
        "Intended Audience :: Education",
        "Topic :: Education :: Computer Aided Instruction (CAI)",
    ],
    keywords="",
    author="Remy DeCausemaker",
    author_email="remyd@civx.us",
    url="http://fossrit.github.io/hflossk",
    license="GPLv3+",
    packages=find_packages(
    ),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        "flask",
        "mako",
        "flask-mako",
        "flask-compress",
    ],
    #TODO: Deal with entry_points
    #entry_points="""
    #[console_scripts]
    #pythong = pythong.util:parse_args
    #"""
)
