# https://cloud.google.com/functions/docs/tutorials/ocr#functions-prepare-environment-python
# https://nanonets.com/blog/google-cloud-vision/
# https://towardsdatascience.com/google-application-credentials-python-ace518208a7

import os
from google.cloud import vision
import io    
from PIL import Image, ImageDraw
import sys
import shutil

# project_id = os.environ.get("GCP_PROJECT")
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "send-letters/server/handwriting/scripts/application_default_credentials.json"

"""
This function detects text in a png image using Google Cloud Vision image annotator.
It returns a list of identified text characters and the vertices of their bounding polygon.
Note: The function requires Google Application Credentials to exist in the corresponding .json file above.
"""
def detect_text(content):
	# Source: https://cloud.google.com/vision/docs/handwriting#detect_document_text_in_a_remote_image 
	client = vision.ImageAnnotatorClient()
	response = client.text_detection(image=vision.Image(content=content))
	texts = response.text_annotations
	return texts


"""
This function takes in the list of identified text and creates a png image for each character based 
	on the given bounding box.

Inputs: list of identified texts from the detect_text function, the image to cut, 
		and the directory in which to output the individual .png images
"""
def cut_texts(texts, image, png_dir):
	for text in texts:
		# Continue if identified text is not a single character
		if len(text.description) != 1:
			continue
		
		char_unicode = ord(text.description)
		vertices = [(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices]
		# Create new image with the bounding box area and save as PNG
		if vertices:
			# Get coordinates of vertices and give 10 pixel buffer if possible
			left, top = vertices[0]
			right, bottom = vertices[2]
			left = max(0, left - 10) 
			top = max(0, top - 10)  
			right = min(image.width, right + 10)
			bottom = min(image.height, bottom + 10)

			# Crop image with vertex values and save image as a png to the png directory
			cropped_image = image.crop((left, top, right, bottom))
			new_file_name = os.path.join(png_dir, str(char_unicode) + ".png")
			cropped_image.save(new_file_name, 'PNG')


"""
This function displays the bounding boxes around each character given a list of identified text and the
	image of the handwriting.
"""
def display_texts(texts, image):
	# Draw the initial image on a .png
	draw = ImageDraw.Draw(image)

	# Loop through identified text, draw a red bounding box highlighting the corresponding polygon encompassing 
	# 	the text, and draw the identified character(s) in red
	print('Texts:')
	for text in texts[1:]:
		print('\n"{}"'.format(text.description))        
		vertices = (['({},{})'.format(vertex.x, vertex.y)                    
                    for vertex in text.bounding_poly.vertices])
		print('bounds: {}'.format(','.join(vertices)))
		vertices = [(vertex.x, vertex.y) for vertex in text.bounding_poly.vertices]
		draw.polygon(vertices, outline='red')
		draw.text((vertices[0][0], vertices[0][1] - 10), text.description, fill='red')    
	image.show()


if __name__ == "__main__":
	server_dir = sys.argv[0][:-40]
	handwriting_file_loc = os.path.join(server_dir, "handwriting/test_images/testfullclear2.png")

	# Open handwriting test file
	with io.open(handwriting_file_loc, 'rb') as image_file:
		content = image_file.read()
		image = Image.open(io.BytesIO(content)).convert('RGBA')

	# Clear all files in temp directory and create empty temp/png folder
	temp_dir = os.path.join(server_dir, "temp")
	shutil.rmtree(temp_dir, ignore_errors=True, onerror=None)
	png_dir = os.path.join(temp_dir, "png_files")
	os.makedirs(png_dir)

	# Detect text in given content and cut images into individuals .png files
	texts = detect_text(content)
	# print(texts)
	cut_texts(texts, image, png_dir)

	# Display identified texts and their bounding boxes
	display_texts(texts, image)

	# Clear all of temp directory
	# shutil.rmtree(temp_dir, ignore_errors=True, onerror=None)
