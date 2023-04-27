# https://cloud.google.com/functions/docs/tutorials/ocr#functions-prepare-environment-python
# https://nanonets.com/blog/google-cloud-vision/
# https://towardsdatascience.com/google-application-credentials-python-ace518208a7

import os
from google.cloud import vision
import io    
from PIL import Image, ImageDraw

# project_id = os.environ.get("GCP_PROJECT")
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "/Users/tommyrogers/.config/gcloud/application_default_credentials.json"

def detect_text(path):    
	"""Detects text in the file."""
	client = vision.ImageAnnotatorClient()
	with io.open(path, 'rb') as image_file:
		content = image_file.read()
		image = Image.open(io.BytesIO(content)).convert('RGBA')
	draw = ImageDraw.Draw(image)
	response = client.text_detection(image=vision.Image(content=content))
	texts = response.text_annotations
	
	print('Texts:')
	count = 0
	for text in texts:
		if count == 0:
			count += 1
			continue
		print('\n"{}"'.format(text.description))        
		vertices = (['({},{})'.format(vertex.x, vertex.y)                    
                    for vertex in text.bounding_poly.vertices])
		print('bounds: {}'.format(','.join(vertices)))
		vertices = [(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices]
		draw.polygon(vertices, outline='red')
		draw.text((vertices[0][0], vertices[0][1] - 10), text.description, fill='red')    
	image.show()

detect_text("testfullclear2.png")
