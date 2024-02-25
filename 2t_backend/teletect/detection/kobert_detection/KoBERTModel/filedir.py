import os

def get_local_file(file_name):
    root_path = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(root_path, file_name)

MODEL_PATH = get_local_file("model/teletect_kobert_train.pt")