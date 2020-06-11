
command line to create certificate:

openssl req -new -x509 -newkey rsa:2048 -sha256 -nodes -keyout localhost.key -days 3560 -out localhost.crt -config certificate.cnf

angular config:

"start": "ng serve --ssl --ssl-key ssl\\localhost.key  --ssl-cert ssl\\localhost.crt"