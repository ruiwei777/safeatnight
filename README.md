# Safe@Night 
* An SMS alerter system to send scheduled, asychronous text messages
* Data visualisation for crime records in Victoria Australia

[Demo](https://www.safeatnight.cf)

# How to Run
1. It is pretty straightforward. Just routine Django set up is enough. For beginners please check [guide.md](./guide.md).

2. `(optional)` Customise your secrets. Please refer to `passwords_default.py` and `local_settings_default.py` in `src/settings/nightshiftworker/`

## Celery and Google Geocoding API
1. For the SMS alerter to work and set up Celery dependencies, refer to [First Steps with Celery](http://docs.celeryproject.org/en/latest/getting-started/first-steps-with-celery.html#first-steps) and [First steps with Django](http://docs.celeryproject.org/en/latest/django/first-steps-with-django.html)

2. For production environment, HTTPS is needed for Google Geocoding APIs to work. [Certbot](https://certbot.eff.org/) is a good free choice.

# Tech Stack
**Back End**: Python 3.4, Django 1.9, Celery, Twilio REST API

**Front End**: jQuery, D3.js, Bootstrap 3, Google Geocoding API, Google Geolocation API

# License
MIT