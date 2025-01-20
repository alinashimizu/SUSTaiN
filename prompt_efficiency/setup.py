from setuptools import setup, find_packages

setup(
    name="prompt_efficiency",
    version="0.1.0",
    description="A simple tool to help users rate their prompts for efficiency",
    author="Alina Shimizu",
    author_email="alina.shimizu-jozi@mail.mcgill.ca",
    url="https://github.com/alinashimizu/SUSTaiN",
    packages=find_packages(),
    install_requires=[
        #tkinter built in with Python
    ],
    entry_points={
        "console_scripts": [
            "rate-prompt=pop_up.main:main",
        ],
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
)
