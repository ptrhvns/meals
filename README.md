# Meals

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
  python -m pip install -r requirements.txt -r requirements-dev.txt
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

### Running Back-End / API Tests

- Run tests:

  ```sh
  cd api
  source venv/bin/activate # ..if not already active.
  python -m venv venv
  pytest
  ```

- Run tests, and report on test coverage:

  ```sh
  cd api
  source venv/bin/activate # ..if not already active.
  python -m venv venv

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

- Identify outdated API packages, and update them:

  ```sh
  cd api
  source venv/bin/activate # ..if not already active.
  python -m pip list --outdated
  $EDITOR pyproject.toml # Update package version specifications

  # Production
  python -m piptools compile \
    --allow-unsafe \
    --generate-hashes \
    --output-file requirements.txt \
    --resolver=backtracking \
    --upgrade \
    pyproject.toml

  # Development
  python -m piptools compile \
    --allow-unsafe \
    --extra dev \
    --generate-hashes \
    --output-file requirements-dev.txt \
    --resolver=backtracking \
    --upgrade \
    pyproject.toml

  python -m piptools sync requirements.txt requirements-dev.txt
  ```
