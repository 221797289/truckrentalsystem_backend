package za.ac.cput.service;

import za.ac.cput.domain.Insurance;
import za.ac.cput.domain.RentalAgent;
import za.ac.cput.domain.ServiceRecord;

import java.util.List;
/*  Completed By Malesela Modiba
    23 May 2024
 */
public interface IServiceRecordService extends IService<ServiceRecord,Integer>{
    ServiceRecord update(ServiceRecord serviceRecord);
    List<ServiceRecord> getAll();
}
