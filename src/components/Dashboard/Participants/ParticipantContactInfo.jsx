import React from 'react';
import {HiOutlineUser, HiOutlineMail, HiOutlinePhone} from 'react-icons/hi';
import {formatPhoneNumber} from '@utils/helpers/formatters';

const ParticipantContactInfo = ({data}) => {
  return (
    <div className="max-w-80 space-y-2">
      <div className="flex items-center gap-2">
        <HiOutlineUser className="text-gray-500 text-sm flex-shrink-0" />
        <p
          className="font-semibold text-gray-900 text-base leading-tight truncate"
          title={data.name}
        >
          {data.name}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <HiOutlineMail className="text-gray-500 text-sm flex-shrink-0" />
        <a
          href={`mailto:${data.email}`}
          className="text-gray-600 text-sm font-normal leading-relaxed hover:text-blue-600 transition-colors duration-200"
        >
          {data.email}
        </a>
      </div>

      <div className="flex items-center gap-2">
        <HiOutlinePhone className="text-gray-500 text-sm flex-shrink-0" />
        <div className="flex gap-2">
          <a
            href={`tel:+${data.phoneNumber}`}
            className="text-blue-600 text-sm cursor-pointer hover:underline hover:text-blue-800 transition-colors duration-200"
          >
            {`${formatPhoneNumber(data.phoneNumber)}`}
          </a>
          <span className="text-gray-400">|</span>
          <a
            rel="noreferrer"
            target="_blank"
            href={`https://wa.me/+${data.phoneNumber}`}
            className="text-green-600 text-sm cursor-pointer hover:underline hover:text-green-800 transition-colors duration-200"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ParticipantContactInfo;