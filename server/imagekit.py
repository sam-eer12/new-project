from imagekitio import ImageKit
import os
from dotenv import load_dotenv

load_dotenv()

imagekit = ImageKit(
    public_key=os.getenv('IMAGEKIT_PUBLIC_KEY'),
    private_key=os.getenv('IMAGEKIT_PRIVATE_KEY'),
    url_endpoint=os.getenv('IMAGEKIT_URL_ENDPOINT')
)

imagekit.create_folder(folder_name='crops', parent_folder_path='/')

