"""Execute every cell with IPython in-process: no sockets or global kernel registration.

Rich display data and streams are captured into standard nbformat outputs. Errors
fail execution. This is actual sequential execution, not insertion of cached results.
"""
from pathlib import Path
import os, sys
BASE=Path(__file__).resolve().parent
os.environ.setdefault('MPLCONFIGDIR','/tmp/gmp-matplotlib')
os.environ.setdefault('IPYTHONDIR','/tmp/gmp-ipython')
import nbformat
from IPython.core.interactiveshell import InteractiveShell
from IPython.utils.capture import capture_output
os.chdir(BASE); sys.path.insert(0,str(BASE))
nb=nbformat.read(BASE/'index.ipynb',as_version=4)
shell=InteractiveShell.instance()
count=0
for index,cell in enumerate(nb.cells):
 if cell.cell_type!='code': continue
 count+=1; print(f'Executing code cell {count} (notebook cell {index})',flush=True)
 with capture_output(stdout=True,stderr=True,display=True) as captured:
  result=shell.run_cell(cell.source,store_history=True)
 if result.error_before_exec: raise result.error_before_exec
 if result.error_in_exec: raise result.error_in_exec
 cell.execution_count=count; cell.outputs=[]
 if captured.stdout: cell.outputs.append(nbformat.v4.new_output('stream',name='stdout',text=captured.stdout))
 if captured.stderr: cell.outputs.append(nbformat.v4.new_output('stream',name='stderr',text=captured.stderr))
 for output in captured.outputs:
  cell.outputs.append(nbformat.v4.new_output('display_data',data=output.data,metadata=output.metadata))
nb.metadata['execution_method']='Sequential IPython InteractiveShell in-process; sandbox prohibits kernel socket binding.'
nbformat.validate(nb); nbformat.write(nb,BASE/'index.ipynb')
print(f'Executed {count} code cells without errors; saved actual rich outputs.')
