# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.9.7

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT [ "python", "app.py" ]