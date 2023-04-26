import subprocess
import os


# convert file.png file.pnm        # PNG to PNM
# potrace file.pnm -s -o file.svg  # PNM to SVG

current_dir = "send-letters/handwriting/"

# Open all files from the png directory
png_directory = current_dir + "png_files"
for filename in os.listdir(png_directory):
    f = os.path.join(png_directory, filename)
    
    # Break if file is not a '.pvg' file
    if not os.path.isfile(f) or not filename[-4:] == ".png":
        break

    pnm_file = current_dir + filename[:-4] + ".svg"
    print(filename)
    # subprocess.run(["convert", current_dir + filename, pnm_file])



# subprocess.run(["convert", png_file, pnm_file])
