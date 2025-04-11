from channels.generic.websocket import AsyncJsonWebsocketConsumer

class FilmConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add("films_updates", self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("films_updates", self.channel_name)

    async def film_update(self, event):
        await self.send_json(event)