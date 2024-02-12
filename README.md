# Meals

NOTE: I have paused work on this project to focus on other things.                                                                     
However, there are a number of completed features worth checking out.
They were implemented using a number of interesting technologies, and
they all have good coverage with automated tests.

## Description

This is a portfolio project. It's a web application for managing meals (e.g.
recipes).

## Technologies

Web client:

- FontAwesome
- Radix UI
- React
- Sass
- TypeScript

API server:

- Celery
- Django
- Django REST framework
- mypy
- PostgreSQL
- Python
- Redis

## Architecture Notes

For the API, I wanted to try following the advice in this article:

[Django Views — The Right Way](https://spookylukey.github.io/django-views-the-right-way/)

That article inspired me to create code that's simpler and easier to understand
than what I would have created otherwise. However, I also ended up creating too
much "boilerplate," which I'm not happy with. In the future, I'd like to find a
way to improve things.

## Setting Up a Development Environment

The following assumes the use of a Linux development environment (tested on
Ubuntu 20.04).

- Install [PostgreSQL](https://www.postgresql.org/) (tested on version 12.8):

  ```sh
  sudo apt update -y
  sudo apt install postgresql postgresql-contrib
  ```

- Configure PostgreSQL:

  ```sh
  sudo service postgresql start
  sudo -u postgres createuser --interactive

    Enter name of role to add: meals
    Shall the new role be a superuser? (y/n) y

  sudo -u postgres createdb meals
  sudo -u postgres psql

    alter user meals password '$PASSWORD';
    \q

  psql -d meals -U meals -W # Test that user and privileges work.

    create table testtable (id serial primary key, testcol text);
    drop table testtable;
    \q
  ```

- Install [Redis](https://redis.io/) (tested on version 6.0.6):

  ```sh
  sudo apt update -y
  sudo apt install redis-server
  ```

- Configure Redis:

  ```sh
  sudo $EDITOR /etc/redis/redis.conf

    # ...
    # supervised no
    supervised systemd
    # ...
    # requirepass foobared
    requirepass $PASSWORD
    # ...

  sudo service redis-server restart
  ```

- Install programming language version managers:

  - [pyenv](https://github.com/pyenv/pyenv)
  - [nodenv](https://github.com/nodenv/nodenv)

- Install Python:

  ```sh
  cd api
  PYTHON_VERSON=$(awk -F/ '{print $1}' .python-version)
  pyenv install $PYTHON_VERSION
  pyenv shell $PYTHON_VERSION
  ```

- Install API packages:

  ```sh
  cd api
  python -m venv venv
  source venv/bin/activate
  python -m pip install --upgrade pip wheel
  python -m pip install . && pip install .[dev]
  python -m pip check # Ensure no broken dependencies
  ```

- Install Node.js:

  ```sh
  cd web
  NODE_VERSION=$(cat .node-version)
  nodenv install $NODE_VERSION
  nodenv shell $NODE_VERSION
  ```

- Install web packages:

  ```sh
  cd web
  npm install
  npx playwright install chromium firefox

  # To avoid running this sudo command, run the end-to-end tests for the web
  # subproject, and follow the instructions in the test errors to install the
  # dependencies directly for the browsers above.
  sudo npx playwright install-deps chromium firefox
  ```

- Setup environment variables for API server:

  ```sh
  cd api
  source venv/bin/activate # ...if not already active.
  cp config/.env.example config/.env

  # Generate a SECRET_KEY for use below.
  python manage.py generate_secret_key

  # Edit config file, and put in valid values.
  $EDITOR config/.env
  ```

- Run database migrations:

  ```sh
  cd api
  source venv/bin/activate # ...if not already active.
  python manage.py migrate
  ```

- Create Django superuser for access to the admin site (not currently used):

  ```sh
  cd api
  source venv/bin/activate # ..if not already active.
  python manage.py createsuperuser
  ```

## Running Development Processes

- Start the Django server (API server):

  ```sh
  cd api
  source venv/bin/activate # ..if not already active.
  python ./manage.py runserver
  ```

- Start Celery (background jobs):

  ```sh
  cd api
  source venv/bin/activate # ..if not already active.
  watchmedo auto-restart --directory=./ -p '*tasks*.py' -R -- celery -A config worker -l INFO
  ```

- Start the React server (web client):

  ```sh
  cd web
  npm run dev
  ```

### Running Front-End / Web Tests

- Create test user within the API:

  ```sh
  cd api
  source venv/bin/activate # ..if not already active.
  python manage.py shell # TODO this user creation needs to be automated

      >>> from datetime import datetime
      >>> from django.conf import settings
      >>> from django.contrib.auth.models import User
      >>> from zoneinfo import ZoneInfo
      >>> user = User.objects.create_user('testuser', password='testpassword')
      >>> user.email_confirmed_datetime = datetime.now(tz=ZoneInfo(settings.TIME_ZONE))
      >>> user.is_active=True
      >>> user.save()
      >>> exit()
  ```

- Ensure API server is running on correct port:

  ```sh
  # In a separate shell...
  cd api
  source venv/bin/activate # ..if not already active.
  python ./manage.py runserver 5174
  ```

- Run all tests:

  ```sh
  cd web
  npm test
  ```

- Run unit tests:

  ```sh
  cd web
  npm run test:unit
  ```

- Run unit tests, and report on test coverage:

  ```sh
  cd web
  npm run test:unit:coverage
  ```

- Run end-to-end (e2e) tests:

  ```sh
  cd web
  npm run test:e2e
  npm run test:e2e:report # Optional: see HTML report.
  ```

### Running Back-End / API Tests

- Run unit tests:

  ```sh
  cd api
  source venv/bin/activate # ..if not already active.
  pytest
  ```

- Run unit tests, and report on test coverage:

  ```sh
  cd api
  source venv/bin/activate # ..if not already active.

  # Pick one of:
  pytest --cov --cov-report html # HTML report
  pytest --cov --cov-report term-missing # terminal report

  # Open htmlcov/index.html with a browser if HTML report was chosen.
  ```

## Updating Development Dependencies

- Identify outdated web packages, and update them:

  ```sh
  cd web
  npm outdated
  $EDITOR package.json # Update package version specifications
  npm update --save
  ```

- Identify outdated API packages, and update them (not necessarily a good
  production process, but good enough for this project):

  ```sh
  cd api
  source venv/bin/activate # ..if not already active.
  python -m pip list --outdated
  $EDITOR pyproject.toml # Update package version specifications
  python -m pip install . && pip install .[dev]
  ```
