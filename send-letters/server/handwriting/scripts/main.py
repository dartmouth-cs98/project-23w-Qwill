import sys
import os


if __name__ == '__main__':
    # Check for correct inputs
    if len(sys.argv) != 2:
        print('Usage: python main.py [path/to/image]')
        sys.exit(1)
    
    # Get path to server from args (handwriting/scripts/main.py is 27 characters)
    server_dir = sys.argv[0][:-27]
    print(server_dir + sys.argv[1])



    # # Generate the .ttf file and save it to some path
    # # ttf_path = current_dir + "/path/to/generated.ttf"

    # # Print the path to stdout
    # # print(ttf_path)
    # print(image_path)

    # # Make sure to flush the stdout buffer to ensure the message is sent immediately
    # sys.stdout.flush()




# try:
#     # Read the base64-encoded image from stdin
#     # base64_image = sys.stdin.read()

#     # # Decode the image data from base64
#     # image_data = base64.b64decode(base64_image)

#     print("yay")

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