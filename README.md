# Meals

## Description

This is a website for managing meals (e.g. recipes, menus, shopping lists, etc.).

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

# Testing

For this project, I wanted to try an experiment where I rely on static typing,
linting, and so on, but don't do any automated testing to see how far I get. If
the pain get to be too much, then I might change my mind.

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
  cp config/.env.example config/.env

  # Generate a SECRET_KEY for use below.
  python manage.py generate_secret_key

  # Edit config file, and put in valid values.
  $EDITOR config/.env
  ```

- Run database migrations:

  ```sh
  cd api
  python manage.py migrate
  ```

- Create Django superuser for access to the admin site:

  ```sh
  cd api
  python manage.py createsuperuser
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
  python -m pip list --outdated
  $EDITOR pyproject.toml # Update package version specifications

  python -m piptools compile \
    --allow-unsafe \
    --generate-hashes \
    --output-file requirements.txt \
    --resolver=backtracking \
    --upgrade \
    pyproject.toml
  
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

## Running Development Processes

- Start the Django server (API server):

  ```sh
  cd api
  python ./manage.py runserver
  ```

- Start Celery (background jobs):

  ```sh
  cd api
  watchmedo auto-restart --directory=./ -p '*tasks*.py' -R -- celery -A config worker -l INFO
  ```

- Start the React server (web client):

  ```sh
  cd web
  npm run dev
  ```
