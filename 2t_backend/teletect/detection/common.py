from dotenv import dotenv_values

def is_force_cpu_mode():
    try:
        detection_force_cpu_string = dotenv_values(".env")["DETECTION_FORCE_CPU"]
        detection_force_cpu = True if detection_force_cpu_string == "true" else False
    except KeyError:
        detection_force_cpu = False
    if detection_force_cpu == True:
        return True
    else:
        return False