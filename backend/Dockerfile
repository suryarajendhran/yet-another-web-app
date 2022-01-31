FROM tiangolo/uvicorn-gunicorn-starlette:python3.9

COPY ./Pipfile /app/Pipfile

COPY ./Pipfile.lock /app/Pipfile.lock

RUN pip install pipenv

WORKDIR /app

RUN pipenv lock -r > requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY . /app/