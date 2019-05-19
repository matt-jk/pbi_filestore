#
# MIT License
# copyright (c) Matt Kalal
#
import base64
import sys
import os

FileName = sys.argv[1]
outFileName = "{}_{}.txt".format(os.path.splitext(FileName)[0],os.path.splitext(FileName)[1].split('.')[1])

#
# encode file to base64
#
with open(FileName,'rb') as filehandle:
    file_b64 = base64.b64encode(filehandle.read())

#
# In rudimentary testing, things worked well with less than 3000 lines
# and if each line was not too much longer than 1000 bytes / characters
#
# So see how many characters long each line will be if we target 2000 lines
# and adjust if/as needed
#

numlines = 2500
linelength = round(len(file_b64) / numlines)

print('****')
print('Input File: {}'.format(os.path.normpath(FileName)))
print('Output File: {}'.format(os.path.normpath(outFileName)))
print('Encoded File Length: {}'.format(len(file_b64)))
print('Target number of lines: {}'.format(numlines))
print('Length of each line: {}'.format(linelength))


itr = 0
line_no = 0
line_content = ""

with open(outFileName,'w') as out_handle:
    for char in file_b64:
        itr += 1
        line_content += chr(char)
        #
        # after the linelength, start another line
        #
        if itr % linelength == 0:
            out_handle.write ( "{}|{}{}\n".format(os.path.normpath(FileName),("000000" + str(line_no))[-6:],line_content) )
            line_no += 1
            line_content = ""
    #
    # print the last piece
    #
    out_handle.write ( "{}|{}{}\n".format(os.path.normpath(FileName),("000000" + str(line_no))[-6:],line_content) )


print("finished")
