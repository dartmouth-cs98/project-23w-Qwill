# import helper libraries
import sys
import os
import base64
import io
from PIL import Image, ImageDraw
import shutil

# import helper functions
import google_cloud_vision
import png_to_svg
import font_generation


if __name__ == '__main__':
    # Check for correct inputs
    if len(sys.argv) != 2:
        print('Usage: python main.py [user username]')
        sys.exit(1)

    try:
        # Get path to server (handwriting/scripts/main.py is 27 characters) and username from args 
        server_dir = sys.argv[0][:-27]
        username = sys.argv[1]

        # Clear all files in temp directory and create empty temp folder for user
        temp_dir = os.path.join(server_dir, "temp_" + username)
        shutil.rmtree(temp_dir, ignore_errors=True, onerror=None)
        os.makedirs(temp_dir)

        # Set path to credentials for Google Cloud Vision
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(server_dir, "handwriting/scripts/application_default_credentials.json")

        # Read the base64image from stdin and decode the image into the handwriting sample
        base64_image = sys.stdin.read()
        handwriting_sample_image = base64.b64decode(base64_image)

        # Run the GCV text detection on the handwriting sample
        try:
            texts = google_cloud_vision.detect_text(handwriting_sample_image)
        except Exception as err:
            sys.stderr.write(str(err))
            sys.exit(50)
        
        # Exit with code 51 if no text detected
        if (texts == []):
            sys.exit(51)
        # print(texts)
        
        # Initialize a png directory and cut handwriting image into png files for each character (represented by ascii file name)
        try:
            image = Image.open(io.BytesIO(handwriting_sample_image)).convert('RGBA')
            png_dir = os.path.join(temp_dir, "png_files")
            os.makedirs(png_dir)
            google_cloud_vision.cut_texts(texts, image, png_dir)
        except Exception as err:
            sys.stderr.write(str(err))
            sys.exit(52)

        # Initialize an svg directory and transform all png images into svg format 
        try:
            png_to_svg.convert_png_dir_to_svg_dir(png_dir)
        except Exception as err:
            sys.stderr.write(str(err))
            sys.exit(53)

        # Generate font file using svg directory
        try:
            svg_dir = os.path.join(temp_dir, "svg_files")
            print(svg_dir)
        except Exception as err:
            sys.stderr.write(str(err))
            sys.exit(54)


        # Write the generated TTF file to stdout
        # with open(server_dir + "handwriting/Qwill-font-test.ttf", 'rb') as f:
        #     ttf_file = f.read()
        # sys.stdout.buffer.write(ttf_file)







        # Clear all files in temp directory
        # shutil.rmtree(temp_dir, ignore_errors=True, onerror=None)
    
    except Exception as err:
        sys.stderr.write(str(err))





    # # Generate the .ttf file and save it to some path
    # # ttf_path = current_dir + "/path/to/generated.ttf"

    # # Print the path to stdout
    # # print(ttf_path)
    # print(image_path)

    # # Make sure to flush the stdout buffer to ensure the message is sent immediately
    # sys.stdout.flush()



# try:

#     # Read the input from stdin
#     # input_bytes = b""
#     # while True:
#     #     chunk = sys.stdin.buffer.read(1024)
#     #     if not chunk:
#     #         break
#     #     input_bytes += chunk

#     # # Decode the base64-encoded image data and create a PIL Image object
#     # input_io = io.BytesIO(input_bytes)
#     # image = Image.open(input_io).convert('RGBA')



#     # # Do some processing on the image data...

#     # # Write the generated TTF file to stdout
#     # with open("send-letters/server/handwriting/Qwill-font-test.ttf", 'rb') as f:
#     #     ttf_file = f.read()
#     # sys.stdout.buffer.write(ttf_file)

# except Exception as err:
#     # Write the error message to stderr
#     sys.stderr.write(str(err))

# # delete all generated files
# # ...