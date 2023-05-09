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


"""
This function handles errors by outputting them to stderr, deleting the temp directory and all contained
    files, and exiting with the given exit code
"""
def handle_error(err, temp_dir, exit_code):
    sys.stderr.write(str(err))
    shutil.rmtree(temp_dir, ignore_errors=True, onerror=None)
    sys.exit(exit_code)


if __name__ == '__main__':
    # Check for correct inputs
    if len(sys.argv) != 3:
        print('Usage: python main.py [user username] [user numCustomFonts]')
        sys.exit(1)

    print("Python: past arg checking")

    try:
        # Get path to server (handwriting/scripts/main.py is 27 characters) and username from args 
        server_dir = sys.argv[0][:-27]
        username = sys.argv[1]
        numCustomFonts = sys.argv[2]

        # Clear all files in temp directory and create empty temp folder for user
        temp_dir = os.path.join(server_dir, "temp_" + username)
        shutil.rmtree(temp_dir, ignore_errors=True, onerror=None)
        os.makedirs(temp_dir)

        print("Python: past arg checking")

        # Set path to credentials for Google Cloud Vision
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(server_dir, "handwriting/scripts/application_default_credentials.json")

        print("Python: load in credential")


        # Read the base64image from stdin and decode the image into the handwriting sample
        base64_image = sys.stdin.read()
        handwriting_sample_image = base64.b64decode(base64_image)

        print("Python: read in image")


        # Run the GCV text detection on the handwriting sample
        try:
            texts = google_cloud_vision.detect_text(handwriting_sample_image)
        except Exception as err:
            handle_error(err, temp_dir, 50)
        
        # Exit with code 51 if no text detected
        if (texts == []):
            handle_error("", temp_dir, 51)
        # print(texts)
        
        # Initialize a png directory and cut handwriting image into png files for each character (represented by ascii file name)
        try:
            image = Image.open(io.BytesIO(handwriting_sample_image)).convert('RGBA')
            png_dir = os.path.join(temp_dir, "png_files")
            os.makedirs(png_dir)
            google_cloud_vision.cut_texts(texts, image, png_dir)
        except Exception as err:
            handle_error(err, temp_dir, 52)

        # Initialize an svg directory and transform all png images into svg format 
        try:
            png_to_svg.convert_png_dir_to_svg_dir(png_dir)
        except Exception as err:
            handle_error(err, temp_dir, 53)

        # Generate font file using svg directory
        try:
            svg_dir = os.path.join(temp_dir, "svg_files")
            font_name = str(username) + "-font-" + str(int(numCustomFonts)+1)
            default_font_path = os.path.join(server_dir, "handwriting/LibreBaskerville-Regular.ttf")
            font_generation.generate_font(svg_dir, default_font_path, font_name)
        except Exception as err:
            handle_error(err, temp_dir, 54)

        # Write the generated TTF file to stdout
        try:
            output_ttf = os.path.join(os.path.dirname(svg_dir), font_name + ".ttf")
            with open(output_ttf, 'rb') as ttf_file:
                ttf_file_content = ttf_file.read()
                ttf_base64 = base64.b64encode(ttf_file_content)

            sys.stdout.buffer.write(ttf_base64)

        except Exception as err:
            handle_error(err, temp_dir, 55)

        # Clear all files in temp directory
        shutil.rmtree(temp_dir, ignore_errors=True, onerror=None)
    
    except Exception as err:
        sys.stderr.write(str(err))
