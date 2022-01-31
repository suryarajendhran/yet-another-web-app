from sqlite3 import OperationalError
import databases
from os import environ
from starlette.applications import Starlette
from asyncpg.exceptions import DuplicateTableError
from starlette.config import Config
from starlette.responses import JSONResponse, Response
from starlette.routing import Route

config = Config('.env')
DATABASE_URL = config('DATABASE_URL')
if 'PG_PORT_5432_TCP_ADDR' in environ.keys():
    DATABASE_URL = f'postgresql://postgres:{environ["PG_ENV_POSTGRES_PASSWORD"]}@{environ["PG_PORT_5432_TCP_ADDR"]}'
    print(f'DATABASE URL UPDATED TO: {DATABASE_URL}')

database = databases.Database(DATABASE_URL)

create_table_query = """CREATE TABLE Items (id INTEGER PRIMARY KEY, type VARCHAR(100), title VARCHAR(100), position INTEGER)"""
select_table_query = """SELECT type, title, position, id from Items;"""
drop_table_query = """DROP TABLE Items"""

insert_query = "INSERT INTO Items(type, title, position) VALUES (:type, :title, :position)"
update_position_query = "UPDATE Items SET position = :position WHERE id = :id"
seed_data = [
    {"type": "bank-draft", "title": "Bank Draft", "position": 0},
    {"type": "bill-of-lading", "title": "Bill of Lading", "position": 1},
    {"type": "invoice", "title": "Invoice", "position": 2},
    {"type": "bank-draft-2", "title": "Bank Draft 2", "position": 3},
    {"type": "bill-of-lading-2", "title": "Bill of Lading 2", "position": 4}
]


async def setup_app():
    await database.connect()
    try:
        rows = await database.execute(query=create_table_query)
    except OperationalError:
        print('Table already exists so skipping seed')
    except DuplicateTableError:
        print('Table already exists so skipping seed')
    else:
        await database.execute_many(query=insert_query, values=seed_data)


async def teardown_app():
    # await database.execute(query=drop_table_query)
    await database.disconnect()

# async def fetch_items(request):


async def fetch_items(request):
    rows = await database.fetch_all(query=select_table_query)
    items = []
    for row in rows:
        item = {}
        item['type'] = row[0]
        item['title'] = row[1]
        item['position'] = row[2]
        item['id'] = row[3]
        items.append(item)
    return JSONResponse(items)


async def update_items(request):
    updated_items = await request.json()
    try:
        await database.execute_many(query=update_position_query, values=updated_items)
    except Error:
        return JSONResponse({err: Error})
    else:
        return Response(status_code=200)
    # return await fetch_items(request=request)


app = Starlette(debug=True, routes=[
    Route('/', fetch_items, methods=["GET"]),
    Route('/', update_items, methods=["POST"]),
], on_startup=[setup_app], on_shutdown=[teardown_app])
