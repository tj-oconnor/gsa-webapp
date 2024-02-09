FROM python:3.8-slim

RUN apt-get update -y -qq 

RUN apt-get install -y -qq build-essential supervisor \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY src/ /app
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 5000/tcp
EXPOSE 3000/tcp

USER root

CMD ["/usr/bin/supervisord"]