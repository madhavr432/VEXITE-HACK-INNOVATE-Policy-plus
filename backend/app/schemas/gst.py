from pydantic import BaseModel

class GstStatusResponse(BaseModel):
    module: str
    status: str
