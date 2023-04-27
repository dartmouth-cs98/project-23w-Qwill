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
	response = client.text_detection(image=vision.Image(content=content))
	texts = response.text_annotations

	return texts, image

def cut_texts(texts, image):
	for text in texts:
		if len(text.description) == 1:
			unicode_int = ord(text.description)
			vertices = [(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices]
			# Create new image with the bounding box area and save as PNG
			if vertices:
				left, top = vertices[0]
				right, bottom = vertices[2]
				left = max(0, left - 10)
				top = max(0, top - 10)
				right = min(image.width, right + 10)
				bottom = min(image.height, bottom + 10)
				cropped_image = image.crop((left, top, right, bottom))
				script_dir = os.path.dirname(os.path.abspath(__file__))
				png_dir = os.path.join(script_dir, '..', 'png_files')
				new_file_name = os.path.join(png_dir, str(unicode_int) + ".png")
				cropped_image.save(new_file_name, 'PNG')
	
def display_texts(texts, image):
	draw = ImageDraw.Draw(image)

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

if __name__ == "__main__":
	texts, image = detect_text("/Users/tommyrogers/Desktop/SendLetters/project-23w-send-letters/send-letters/handwriting/testfullclear2.png")
	cut_texts(texts, image)

	# display_texts(texts, image)

