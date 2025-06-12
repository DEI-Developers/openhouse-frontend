import {useRef} from 'react';
import {QRCodeCanvas} from 'qrcode.react';
import {BASE_PATH_URL} from '@config/index';
import CustomModal from '@components/UI/Modal/CustomModal';

const SuccessModal = ({isOpen, onClose, code}) => {
  const qrRef = useRef(null);

  function onDownloadClick() {
    const node = qrRef.current;
    if (node == null) {
      return;
    }
    const dataURI = node.toDataURL('image/png');
    downloadStringAsFile(dataURI, `qr_${code}.png`);
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onToggleModal={onClose}
      closeOnBackdropClick={false}
      className="p-0 w-full sm:max-w-lg"
    >
      <div className="bg-white px-4 py-2 rounded-lg flex flex-col items-center">
        <h3 className="text-center text-lg font-bold text-primary mt-4">
          ¡Éxito!
        </h3>
        <p className="text-center text-sm text-gray-500 my-3">
          Muestra este código QR en la entrada del evento para poder registrar
          tu participación.
        </p>
        <QRCodeCanvas
          marginSize={1}
          bgColor="#fff"
          level="H"
          ref={qrRef}
          value={code}
          size={256}
          title={code}
          imageSettings={{
            src: `${BASE_PATH_URL}/uca-logo.png`,
            x: undefined,
            y: undefined,
            height: 50,
            width: 50,
            opacity: 1,
            excavate: true,
          }}
        />
        <button
          type="button"
          onClick={onDownloadClick}
          className="inline-flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-white shadow-sm mt-4"
        >
          Descargar
        </button>
      </div>
    </CustomModal>
  );
};

function downloadStringAsFile(data, filename) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = data;
  a.click();
}

export default SuccessModal;
