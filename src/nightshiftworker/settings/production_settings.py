"""
Django settings for nightshiftworker project.

Generated by 'django-admin startproject' using Django 1.9.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.9/ref/settings/
"""
from django.conf import settings
if not settings.DEBUG:
    import os

    # Build paths inside the project like this: os.path.join(BASE_DIR, ...)
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    # Quick-start development settings - unsuitable for production
    # See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/



    ALLOWED_HOSTS = ['www.safeatnight.cf', 'safeatnight.cf']
    ALLOWED_HOSTS = ['*']



    ROOT_URLCONF = 'nightshiftworker.urls'

    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [os.path.join(BASE_DIR, 'templates')]
            ,
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                ],
            },
        },
    ]

    WSGI_APPLICATION = 'nightshiftworker.wsgi.application'

    # Database
    # https://docs.djangoproject.com/en/1.9/ref/settings/#databases

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(os.path.dirname(BASE_DIR), 'db.sqlite3'),
        }
    }

    # Password validation
    # https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

    AUTH_PASSWORD_VALIDATORS = [
        {
            'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        },
    ]

    # Internationalization
    # https://docs.djangoproject.com/en/1.9/topics/i18n/

    # LANGUAGE_CODE = 'en-us'
    LANGUAGE_CODE = 'en-au'

    LOGIN_URL = '/login/'

    TIME_ZONE = 'Australia/Melbourne'

    USE_I18N = True

    USE_L10N = True

    USE_TZ = True

    # Crispy forms style
    CRISPY_TEMPLATE_PACK = 'bootstrap3'

    # Static files (CSS, JavaScript, Images)
    # https://docs.djangoproject.com/en/1.9/howto/static-files/

    STATIC_URL = '/static/'

    STATICFILES_DIRS = [
        os.path.join(BASE_DIR, "static"),

    ]

    STATIC_ROOT = os.path.join(os.path.dirname(BASE_DIR), "StaticRoot")

    # django-compressor

    STATICFILES_FINDERS = (
        'django.contrib.staticfiles.finders.FileSystemFinder',
        'django.contrib.staticfiles.finders.AppDirectoriesFinder',
        # other finders..
        'compressor.finders.CompressorFinder',
    )


    COMPRESS_ENABLED = True

    COMPRESS_JS_FILTERS = [
        'compressor.filters.template.TemplateFilter',
    ]

    # Celery Settings
    CELERY_TIMEZONE = 'Australia/Melbourne'
    CELERY_ENABLE_UTC = False
    CELERY_ACCEPT_CONTENT = ['pickle', 'json', 'msgpack', 'yaml']

    # django-datetime-widget

    # django-twilio

    DJANGO_TWILIO_FORGERY_PROTECTION = True

