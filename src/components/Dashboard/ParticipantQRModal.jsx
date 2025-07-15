import {useRef} from 'react';
import {QRCodeCanvas} from 'qrcode.react';
import {BASE_PATH_URL} from '@config/index';
import CustomModal from '@components/UI/Modal/CustomModal';

const ParticipantQRModal = ({isOpen, onClose, participant}) => {
  const qrRef = useRef(null);

  function onDownloadClick() {
    const node = qrRef.current;
    if (node == null) {
      return;
    }
    const dataURI = node.toDataURL('image/png');
    downloadStringAsFile(
      dataURI,
      `qr_participante_${participant?.name?.replace(/\s+/g, '_') || 'participante'}_${participant?.id || 'unknown'}.png`
    );
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onToggleModal={onClose}
      closeOnBackdropClick={true}
      className="p-0 w-full sm:max-w-lg"
    >
      <div className="bg-white px-4 py-2 rounded-lg flex flex-col items-center">
        <h3 className="text-center text-lg font-bold text-primary mt-4">
          Código QR del Participante
        </h3>
        {participant?.name && (
          <p className="text-center text-sm text-gray-600 mt-2">
            {participant.name}
          </p>
        )}
        <p className="text-center text-sm text-gray-500 my-3">
          Código QR para el participante
        </p>
        <QRCodeCanvas
          marginSize={1}
          bgColor="#fff"
          level="H"
          ref={qrRef}
          value={participant?.phoneNumber || ''}
          size={256}
          title={participant?.phoneNumber || ''}
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
        <div className="flex gap-2 w-full mt-4">
          <button
            type="button"
            onClick={onDownloadClick}
            className="inline-flex flex-1 justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-white shadow-xs"
          >
            Descargar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex flex-1 justify-center rounded-lg bg-gray-300 px-3 py-3 text-sm font-semibold text-gray-700 shadow-xs"
          >
            Cerrar
          </button>
        </div>
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

export default ParticipantQRModal;
