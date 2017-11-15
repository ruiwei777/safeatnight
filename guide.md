# virtualenv and Django setup

## pip and virtualenv setup
1. `sudo apt-get install python3.4 pythpn3-pip`
2. `sudo pip3 install virtualenv`

cd into the project folder, which contains `src`

3. virtualenv -p python3.4 VENV # create a virtualenv in VENV

## install python dependencies
4. `source VENV/bin/activate` # activate virtualenv (it might already be activated from the last step, but doing this again has ho harm)

make sure virtualenv is activated before proceeding, and do not use `sudo` any more.

5. `pip3 install -r requirements.txt` # install python dependencies

## Django routine setup
6. `python src/manage.py collectstatic`
7. `python src/manage.py makemigrations`
8. `python src/manage.py migrate`
9. `python src/manage.py runserver` # finish, now run it.

## Lessons
* on production server, if you want to run Django build-in test server for testing purpose, do `python src/manage.py runserver 0.0.0.0:8000` instead of just  `python src/manage.py runserver`. And don't forget to allow port 8000 for tcp traffics in the firewall rules.


