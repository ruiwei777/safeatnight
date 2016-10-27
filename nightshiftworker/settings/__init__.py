try:
    from .base import *
except:
    pass

try:
    from .local_settings import *
except:
    pass

try:
    from .production_settings import *
except:
    pass