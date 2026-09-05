from pydantic import BaseModel

class BusStatusResponse(BaseModel):
    module: str
    status: str
