try:
    from .base import *
except:
    pass

try:
    from .local_settings import *
except ImportError:
    print('local_settings.py not found')
    print('please refer to src/nightshiftworker/settings/local_settings_default.py')

try:
    from .production_settings import *
except:
    pass