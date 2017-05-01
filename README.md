# safeatnight
A graduate project which uses Python Django, Celery and Twilio API to build an SMS alerter system, and D3.js to visualise crime rate by suburb in Victoria Australia. See demo: https://www.safeatnight.cf.

# How to Run
1. Routine Django set up including avtivate virtual environment, install dependencies, collect static files, database migrations, etc. For beginners please check `guide.txt`.
2. You need to put a `passwords.py` inside `src/nightshiftworker/settings`, and assign values to `MY_SERCRET_KEY`, `MY_TWILIO_ACCOUNT_SID`, `MY_TWILIO_AUTH_TOKEN` inside the file. For `MY_SECRET_KEY` you can use [Django Secret Key Generator](http://www.miniwebtool.com/django-secret-key-generator/) to get one. For the other two variables you can assign dummy values.

## After First Run
1. For the SMS alerter function to work you need to set up Celery dependencies. Follow guide from [First Steps with Celery](http://docs.celeryproject.org/en/latest/getting-started/first-steps-with-celery.html#first-steps) then [First steps with Django](http://docs.celeryproject.org/en/latest/django/first-steps-with-django.html)

2. Since it uses Google Geocoding APIs to get user location, if you deploy it onto a live server you NEED TO set up HTTPS connection to get this work. If you own the whole virtual machine (so that you have root permission), [Certbot](https://certbot.eff.org/) is recommended to get a free certificate. But for the localhost test server this is not necessary.

# Tech Stack
**Back End**: Python 3, Django, Celery, Twilio REST API

**Front End**: jQuery, D3.js, Bootstrap, Google Geocoding API, Google Geolocation API

# License
MIT
