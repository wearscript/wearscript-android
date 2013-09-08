"""NOTE: This refers to data that you may not have, it is kept here to demonstrate the structure.  You either need the original data or you need to modify this file with your own."""
import json

DATA = {}
MOVEMENT_DATA = {'biking': [], 'walking': [], 'driving': [], 'still': []}

# Biking: Actively peddeling a bike
MOVEMENT_DATA['biking'].append({"event": "glassborg:1377458315268-000", "start": 1377458378.317, "stop": 1377458515.317})
MOVEMENT_DATA['biking'].append({"event": "glassborg:1377458315268-000", "start": 1377458550.317, "stop": 1377458607.317})
MOVEMENT_DATA['biking'].append({"event": "glassborg:1377458315268-000", "start": 1377458640.317, "stop": 1377458675.945})

# Still: Primarily looking in the same direction with no major body motion.  When using a laptop or watching TV this would be expected.
MOVEMENT_DATA['still'].append({"event": "glassborg:1377376295799-000", "start": 1377376296.911, "stop": 1377376312.911})
MOVEMENT_DATA['still'].append({"event": "glassborg:1377376406181-000", "start": 1377376539.267, "stop": 1377376611.202})
MOVEMENT_DATA['still'].append({"event": "glassborg:1377376664761-000", "start": 1377376668.767, "stop": 1377376837.767})
MOVEMENT_DATA['still'].append({"event": "glassborg:1377378367026-000", "start": 1377378524.063, "stop": 1377378930.063})

# Walking: User is actively walking
MOVEMENT_DATA['walking'].append({"event": "glassborg:1377558445074-000", "start": 1377558452.139, "stop": 1377558588.139})
MOVEMENT_DATA['walking'].append({"event": "glassborg:1377558445074-001", "start": 1377558920.165, "stop": 1377558981.165})
MOVEMENT_DATA['walking'].append({"event": "glassborg:1377641539721-000", "start": 1377641572.792, "stop": 1377641692.792})

# Driving: User is driving a car that is in motion
MOVEMENT_DATA['driving'].append({"event": "glassborg:1377704929276-000", "start": 1377705060.283, "stop": 1377705179.283})
MOVEMENT_DATA['driving'].append({"event": "glassborg:1377704929276-000", "start": 1377704968.283, "stop": 1377705011.283})
MOVEMENT_DATA['driving'].append({"event": "glassborg:1377704929276-001", "start": 1377705298.443, "stop": 1377705399.443})
MOVEMENT_DATA['driving'].append({"event": "glassborg:1377704929276-001", "start": 1377705452.443, "stop": 1377705595.443})
MOVEMENT_DATA['driving'].append({"event": "glassborg:1377704929276-002", "start": 1377705823.315, "stop": 1377705874.315})

DATA['movement'] = MOVEMENT_DATA

SCENE_DATA = {'indoors': [], 'outdoors': []}
SCENE_DATA['indoors'].append({"event": "glassborg:1377376664761-000", "start": 1377376673.767, "stop": 1377376930.767})
SCENE_DATA['indoors'].append({"event": "glassborg:1377722265384-000", "start": 1377722271.402, "stop": 1377722475.402})
SCENE_DATA['indoors'].append({"event": "glassborg:1377729730420-000", "start": 1377729731.522, "stop": 1377729764.522})
SCENE_DATA['indoors'].append({"event": "glassborg:1377641539721-000", "start": 1377641717.792, "stop": 1377641827.792})

SCENE_DATA['outdoors'].append({"event": "glassborg:1377458315268-000", "start": 1377458322.317, "stop": 1377458668.317})
SCENE_DATA['outdoors'].append({"event": "glassborg:1377559153505-000", "start": 1377559155.589, "stop": 1377559242.589})
SCENE_DATA['outdoors'].append({"event": "glassborg:1377641539721-000", "start": 1377641545.792, "stop": 1377641706.792})
SCENE_DATA['outdoors'].append({"event": "glassborg:1377637407861-000", "start": 1377637422.892, "stop": 1377637767.892})

DATA['scene'] = SCENE_DATA
