import sys

help_message = '''apply_template.py: Script to embed synchronization info into an HTML template
Usage: python apply_template.py <template_file_name> <sync_info_file_name>'''

if len(sys.argv) != 3:
	print(sys.argv)
	print(help_message)
	exit()
	
f_template = open(sys.argv[1], 'r')
f_sync = open(sys.argv[2], 'r')
html = f_template.read()
video_id = f_sync.readline().rstrip()
sync = f_sync.read()

html = html.replace('NOW_UC_SLIDES_VIDEO_ID', video_id).replace('NOW_UC_SLIDES_SYNC', sync)

print(html)

f_template.close()
f_sync.close()
