from teletect.common.standard import output_detection_result
from teletect.detection.kobert_detection.KoBERTModel import train
from teletect.detection.kobert_detection.KoBERTModel import predict
from teletect.detection.kobert_detection.KoBERTModel.word_detect import classification

async def detect_voice_phishing_via_kobert(text: str):
    predict_output = predict.run(text)
    predict_result = {}
    
    level = 0
    if predict_output == True:
        level = classification.run(text)
        predict_result = { 'phishing' : predict_output, 'level' : level }
        if level == 3:
            return output_detection_result(score=1)
        elif level == 2:
            return output_detection_result(score=0.9)
        elif level == 1:
            return output_detection_result(score=0.8)
        else:
            return output_detection_result(score=0)
    else:
        predict_result = { 'phishing' : predict_output, 'level' : '0' }
        return output_detection_result(score=0)