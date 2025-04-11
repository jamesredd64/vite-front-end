const Example = () => {
  const [showBlockingModal, setShowBlockingModal] = useState(false);
  
  return (
    <Modal
      isOpen={showBlockingModal}
      onClose={() => {}} // Empty function since we're blocking closure
      isBlocking={true}
      showCloseButton={false}
      className="max-w-[400px] p-6"
    >
      <div className="flex flex-col">
        <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-lg">
          Required Action
        </h5>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          You must make a choice to proceed.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => {
              // Handle action
              setShowBlockingModal(false);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};